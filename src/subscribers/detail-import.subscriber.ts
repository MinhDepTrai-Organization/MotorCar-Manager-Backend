import { DetailImport } from 'src/modules/detail_import/entities/detail_import.entity';
import { Import } from 'src/modules/import/entities/import.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class DetailImportSubscriber
  implements EntitySubscriberInterface<DetailImport>
{
  listenTo() {
    return DetailImport;
  }

  async afterRemove(event: RemoveEvent<DetailImport>) {
    const importId = event.entity?.import?.id;
    if (!importId) {
      return;
    }

    const importRepository = event.manager.getRepository(Import);
    const importEntity = await importRepository.findOne({
      where: { id: importId },
      relations: ['detail_import'],
    });
    if (importEntity && importEntity.detail_imports.length === 0) {
      await importRepository.remove(importEntity);
    }
  }
}
